<?php

namespace App\Controller;

use App\Entity\Post;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\HttpFoundation\File\Exception\FileException;

class PostController extends AbstractController
{
    #[Route('/api/posts', name: 'create_post', methods: ['POST'])]
    public function createPost(
        Request $request,
        EntityManagerInterface $em,
        #[CurrentUser] $user
    ): JsonResponse {

        if (!$user) {
            return new JsonResponse(['message' => 'Unauthorized'], 401);
        }

        // Récupération des champs texte
        $title = $request->request->get('title');
        $description = $request->request->get('description');

        // Récupération du fichier
        $file = $request->files->get('file');

        $post = new Post();
        $post->setTitle($title);
        $post->setDescription($description);
        $post->setUser($user);
        $post->setCreatedAt(new \DateTimeImmutable());

        if ($file) {
            $newFilename = uniqid() . '.' . $file->guessExtension();

            try {
                $file->move(
                    $this->getParameter('uploads_directory'),
                    $newFilename
                );
            } catch (FileException $e) {
                return new JsonResponse(['message' => 'Upload failed'], 500);
            }

            // ici tu choisis où stocker (image pour MVP)
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
