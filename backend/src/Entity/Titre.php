<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use App\Repository\TitreRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ApiResource(
    operations: [new GetCollection()],
    normalizationContext: ['groups' => ['titre:read']],
    order: ['niveau_min' => 'ASC'],
)]
#[ORM\Entity(repositoryClass: TitreRepository::class)]
#[ORM\Table(name: 'titres')]
class Titre
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['titre:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 50)]
    #[Groups(['titre:read'])]
    private ?string $nom = null;

    #[ORM\Column]
    #[Groups(['titre:read'])]
    private int $niveau_min = 1;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): static
    {
        $this->nom = $nom;
        return $this;
    }

    public function getNiveauMin(): int
    {
        return $this->niveau_min;
    }

    public function setNiveauMin(int $niveau_min): static
    {
        $this->niveau_min = $niveau_min;
        return $this;
    }
}
