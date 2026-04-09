<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class UserController extends AbstractController
{
    #[Route('/api/me', methods: ['PATCH'])]
    public function updateMe(Request $request, EntityManagerInterface $em): JsonResponse
    {
        /** @var \App\Entity\User $user */
        $user = $this->getUser();

        if (!$user) {
            return $this->json(['error' => 'Unauthorized'], 401);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['bio'])) {
            $user->setBio($data['bio']);
        }

        $em->flush();

        return $this->json($user);
    }
    #[Route('/api/me/avatar', methods: ['POST'])]

    public function uploadAvatar(
        Request $request,
        EntityManagerInterface $em
    ): JsonResponse {
        /** @var \App\Entity\User $user */
        $user = $this->getUser();

        if (!$user) {
            return $this->json(['error' => 'Unauthorized'], 401);
        }

        /** @var UploadedFile $file */
        $file = $request->files->get('avatar');

        if (!$file) {
            return $this->json(['error' => 'No file uploaded'], 400);
        }

        $newFilename = uniqid() . '.' . $file->guessExtension();

        try {
            $file->move(
                $this->getParameter('uploads_directory'),
                $newFilename
            );
        } catch (FileException $e) {
            return $this->json(['error' => 'Upload failed'], 500);
        }

        // sauvegarde du chemin en DB

        $user->setAvatar('/uploads/' . $newFilename);

        $em->flush();

        return $this->json([
            'avatar' => $user->getAvatar()
        ]);
    }
}
