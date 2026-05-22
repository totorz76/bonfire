<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use App\Service\TitreService;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api', name: 'api_')]
class SecurityController extends AbstractController
{
    public function __construct(
        private UserRepository $userRepository,
        private UserPasswordHasherInterface $hasher,
        private EntityManagerInterface $em,
        private JWTTokenManagerInterface $jwtManager
    ) {}

    #[Route('/register', name: 'register', methods: ['POST'])]
    public function register(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // Champs requis
        if (!isset($data['email'], $data['password'], $data['pseudo'])) {
            return $this->json(['error' => 'Tous les champs sont requis'], 400);
        }

        $email = $data['email'];
        $password = $data['password'];
        $pseudo = $data['pseudo'];

        // Email valide
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return $this->json(['error' => 'Email invalide'], 400);
        }

        // Pseudo déjà utilisé
        if ($this->userRepository->findOneBy(['pseudo' => $pseudo])) {
            return $this->json(['error' => 'Pseudo déjà utilisé'], 409);
        }

        // Password sécurisé
        if (!preg_match('/^(?=.*[A-Z])(?=.*\d).{10,}$/', $password)) {
            return $this->json([
                'error' => 'Mot de passe trop faible (10 caractères, 1 majuscule, 1 chiffre)'
            ], 400);
        }

        // Email déjà utilisé
        if ($this->userRepository->findOneBy(['email' => $email])) {
            return $this->json(['error' => 'Email déjà utilisé'], 409);
        }

        // Création user
        $user = new User();
        $user->setEmail($email);
        $user->setPseudo($pseudo);
        $user->setPassword($this->hasher->hashPassword($user, $password));
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

        // Génération du JWT
        $token = $this->jwtManager->create($user);

        return $this->json([
            'token' => $token
        ]);
    }

    #[Route('/me', name: 'me', methods: ['GET'])]
    public function me(
        #[CurrentUser] ?User $user,
        SerializerInterface $serializer,
        TitreService $titreService,
    ): JsonResponse {
        if (!$user) {
            return $this->json(['error' => 'Non authentifié'], 401);
        }

        $level = $user->getLevel();
        $data = json_decode(
            $serializer->serialize($user, 'json', ['groups' => ['user:read']]),
            true,
            512,
            JSON_THROW_ON_ERROR
        );

        $data['currentTitle'] = $titreService->formatTitre(
            $titreService->getCurrentTitle($level)
        );
        $data['nextTitle'] = $titreService->formatTitre(
            $titreService->getNextTitle($level)
        );

        return $this->json($data);
    }

    #[Route('/logout', name: 'logout', methods: ['POST'])]
    public function logout(): JsonResponse
    {
        return $this->json(['message' => 'Déconnecté']);
    }
}
