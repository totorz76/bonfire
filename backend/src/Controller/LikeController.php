<?php

namespace App\Controller;

use App\Entity\Post;
use App\Entity\Reaction;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

final class LikeController extends AbstractController
{
    #[Route('/api/posts/{id}/like', methods: ['POST'])]
    public function like(
        Post $post,
        EntityManagerInterface $em,
        Security $security
    ): JsonResponse {
        $user = $security->getUser();

        if (!$user) {
            return new JsonResponse(['error' => 'Unauthorized'], 401);
        }

        $reactionRepo = $em->getRepository(Reaction::class);

        $existing = $reactionRepo->findOneBy([
            'user' => $user,
            'post' => $post
        ]);

        if ($existing) {
            $em->remove($existing);
            $em->flush();

            return new JsonResponse([
                'liked' => false
            ]);
        }

        $reaction = new Reaction();
        $reaction->setUser($user);
        $reaction->setPost($post);
        $reaction->setCreatedAt(new \DateTimeImmutable());

        try {
            $em->persist($reaction);
            $em->flush();
        } catch (\Exception $e) {
            return new JsonResponse([
                'error' => 'Already liked'
            ], 400);
        }

        return new JsonResponse([
            'liked' => true
        ]);
    }
}
