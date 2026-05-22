<?php

namespace App\Controller;

use App\Entity\Post;
use App\Entity\User;
use App\Repository\PostRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/admin')]
#[IsGranted('ROLE_ADMIN')]
class AdminController extends AbstractController
{
    public function __construct(
        private UserRepository $userRepository,
        private PostRepository $postRepository,
        private EntityManagerInterface $em,
    ) {
    }

    #[Route('/stats', name: 'admin_stats', methods: ['GET'])]
    public function stats(): JsonResponse
    {
        return $this->json([
            'users' => $this->userRepository->count([]),
            'posts' => $this->postRepository->count([]),
        ]);
    }

    #[Route('/users', name: 'admin_users', methods: ['GET'])]
    public function users(): JsonResponse
    {
        $users = $this->userRepository->findBy([], ['created_at' => 'DESC']);

        $data = array_map(fn (User $user) => [
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'pseudo' => $user->getPseudo(),
            'roles' => $user->getRoles(),
            'created_at' => $user->getCreatedAt()?->format(\DateTimeInterface::ATOM),
            'xp' => $user->getXp(),
        ], $users);

        return $this->json($data);
    }

    #[Route('/posts', name: 'admin_posts', methods: ['GET'])]
    public function posts(): JsonResponse
    {
        $posts = $this->postRepository->findBy([], ['created_at' => 'DESC']);

        $data = array_map(fn (Post $post) => [
            'id' => $post->getId(),
            'title' => $post->getTitle(),
            'description' => $post->getDescription(),
            'created_at' => $post->getCreatedAt()?->format(\DateTimeInterface::ATOM),
            'user' => [
                'id' => $post->getUser()?->getId(),
                'pseudo' => $post->getUser()?->getPseudo(),
            ],
        ], $posts);

        return $this->json($data);
    }

    #[Route('/posts/{id}', name: 'admin_delete_post', methods: ['DELETE'])]
    public function deletePost(int $id): JsonResponse
    {
        $post = $this->postRepository->find($id);

        if (!$post) {
            return $this->json(['error' => 'Post introuvable'], 404);
        }

        $this->em->remove($post);
        $this->em->flush();

        return $this->json(['message' => 'Post supprimé']);
    }

    #[Route('/users/{id}', name: 'admin_delete_user', methods: ['DELETE'])]
    public function deleteUser(int $id, #[CurrentUser] User $admin): JsonResponse
    {
        if ($admin->getId() === $id) {
            return $this->json(['error' => 'Vous ne pouvez pas supprimer votre propre compte'], 400);
        }

        $user = $this->userRepository->find($id);

        if (!$user) {
            return $this->json(['error' => 'Utilisateur introuvable'], 404);
        }

        $this->em->remove($user);
        $this->em->flush();

        return $this->json(['message' => 'Utilisateur supprimé']);
    }
}
