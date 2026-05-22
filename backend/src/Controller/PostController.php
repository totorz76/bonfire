<?php

namespace App\Controller;

use App\Entity\Post;
use App\Service\YoutubeService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class PostController extends AbstractController
{
    public function __construct(
        private YoutubeService $youtubeService,
    ) {
    }

    #[Route('/api/posts', name: 'create_post', methods: ['POST'])]
    public function createPost(
        Request $request,
        EntityManagerInterface $em,
        #[CurrentUser] $user
    ): JsonResponse {

        if (!$user) {
            return new JsonResponse(['message' => 'Unauthorized'], 401);
        }

        $title = $request->request->get('title');
        $description = $request->request->get('description');
        $youtubeInput = $request->request->get('youtubeUrl') ?? $request->request->get('youtube_url');

        /** @var UploadedFile|null $file */
        $file = $request->files->get('file');

        if ($file && str_starts_with((string) $file->getMimeType(), 'video/')) {
            return new JsonResponse([
                'message' => 'Les fichiers vidéo ne sont pas autorisés. Ajoutez un lien YouTube.',
            ], 400);
        }

        $hasFile = $file !== null;
        $hasYoutube = is_string($youtubeInput) && trim($youtubeInput) !== '';

        if ($hasFile && $hasYoutube) {
            return new JsonResponse([
                'message' => 'Choisissez une image ou un lien YouTube, pas les deux.',
            ], 400);
        }

        $post = new Post();
        $post->setTitle($title);
        $post->setDescription($description);
        $post->setUser($user);
        $post->setCreatedAt(new \DateTimeImmutable());

        if ($hasYoutube) {
            $embedUrl = $this->youtubeService->toEmbedUrl($youtubeInput);

            if (!$embedUrl) {
                return new JsonResponse(['message' => 'Lien YouTube invalide'], 400);
            }

            $post->setYoutubeUrl($embedUrl);
        } elseif ($hasFile) {
            $newFilename = uniqid() . '.' . $file->guessExtension();

            try {
                $file->move(
                    $this->getParameter('uploads_directory'),
                    $newFilename
                );
            } catch (FileException $e) {
                return new JsonResponse(['message' => 'Upload failed'], 500);
            }

            $post->setImage('/uploads/' . $newFilename);
        }

        $em->persist($post);
        $em->flush();

        return new JsonResponse([
            'message' => 'Post created successfully',
            'id' => $post->getId()
        ], 201);
    }
}
