<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route('/api', name: 'api_')]
class SecurityController extends AbstractController
{
    public function __construct(
        private UserRepository $userRepository,
        private UserPasswordHasherInterface $hasher,
        private EntityManagerInterface $em
    ) {}

    #[Route('/register', name: 'register', methods: ['POST'])]
    public function register(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // Validation
        if (!isset($data['email'], $data['password'])) {
            return $this->json(['error' => 'Email et password requis'], 400);
        }

        // Check si user existe
        if ($this->userRepository->findOneBy(['email' => $data['email']])) {
            return $this->json(['error' => 'Email déjà utilisé'], 409);
        }

        // Crée user
        $user = new User();
        $user->setEmail($data['email']);
        $user->setPseudo($data['pseudo'] ?? 'user_' . rand(1000, 9999)); // important
        $user->setPassword($this->hasher->hashPassword($user, $data['password']));
        $user->setRoles(['ROLE_USER']);
        $user->setCreatedAt(new \DateTimeImmutable());
        $user->setBio(null);
        $user->setAvatar(null);

        $this->em->persist($user);
        $this->em->flush();

        return $this->json(['message' => 'User créé avec succès'], 201);
    }

    #[Route('/login', name: 'login', methods: ['POST'])]
    public function login(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['email'], $data['password'])) {
            return $this->json(['error' => 'Email et password requis'], 400);
        }

        $user = $this->userRepository->findOneBy(['email' => $data['email']]);

        if (!$user || !$this->hasher->isPasswordValid($user, $data['password'])) {
            return $this->json(['error' => 'Identifiants invalides'], 401);
        }

        // ⚠️ Si tu veux JWT, il faut LexikJWTAuthenticationBundle
        // Pour l'instant, on retourne juste l'user ID

        return $this->json([
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'message' => 'Connecté !'
        ]);
    }

    #[Route('/me', name: 'me', methods: ['GET'])]
    public function me(#[CurrentUser] ?User $user): JsonResponse
    {
        if (!$user) {
            return $this->json(['error' => 'Non authentifié'], 401);
        }

        return $this->json([
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'roles' => $user->getRoles()
        ]);
    }

    #[Route('/logout', name: 'logout', methods: ['POST'])]
    public function logout(): JsonResponse
    {
        return $this->json(['message' => 'Déconnecté']);
    }
}
