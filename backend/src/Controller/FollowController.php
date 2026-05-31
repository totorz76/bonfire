<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

final class FollowController extends AbstractController
{
    #[Route('/api/users/{id}/follow', name: 'user_follow_toggle', methods: ['POST'])]
    public function toggle(
        User $target,
        EntityManagerInterface $em,
        #[CurrentUser] ?User $user,
    ): JsonResponse {
        if (!$user) {
            return $this->json(['error' => 'Non authentifié'], 401);
        }

        if ($user->getId() === $target->getId()) {
            return $this->json(['error' => 'Vous ne pouvez pas vous suivre vous-même'], 400);
        }

        if ($user->isFollowing($target)) {
            $user->unfollow($target);
            $following = false;
        } else {
            $user->follow($target);
            $following = true;
        }

        $em->flush();
        $em->refresh($target);

        return $this->json([
            'following' => $following,
            'followersCount' => $target->getFollowers()->count(),
        ]);
    }
}
