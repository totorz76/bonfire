<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\TitreService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class UserController extends AbstractController
{
    #[Route('/api/users/{id}/profile', methods: ['GET'])]
    public function profile(
        User $user,
        TitreService $titreService,
        Security $security,
    ): JsonResponse {
        $currentUser = $security->getUser();
        $level = $user->getLevel();
        $isOwnProfile = $currentUser instanceof User && $currentUser->getId() === $user->getId();

        $data = [
            'id' => $user->getId(),
            'pseudo' => $user->getPseudo(),
            'bio' => $user->getBio(),
            'avatar' => $user->getAvatar(),
            'level' => $level,
            'xpProgress' => $user->getXpProgress(),
            'followersCount' => $user->getFollowers()->count(),
            'followingCount' => $user->getFollowing()->count(),
            'currentTitle' => $titreService->formatTitre($titreService->getCurrentTitle($level)),
            'nextTitle' => $titreService->formatTitre($titreService->getNextTitle($level)),
            'isFollowing' => $currentUser instanceof User && $currentUser->isFollowing($user),
            'isOwnProfile' => $isOwnProfile,
        ];

        if ($isOwnProfile && $currentUser instanceof User) {
            $data['email'] = $currentUser->getEmail();
        }

        return $this->json($data);
    }

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
