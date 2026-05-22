<?php

namespace App\Service;

use App\Entity\Titre;
use App\Repository\TitreRepository;

class TitreService
{
    public function __construct(
        private TitreRepository $titreRepository,
    ) {
    }

    public function getCurrentTitle(int $level): ?Titre
    {
        return $this->titreRepository->findForLevel($level);
    }

    public function getNextTitle(int $level): ?Titre
    {
        return $this->titreRepository->findNextForLevel($level);
    }

    public function formatTitre(?Titre $titre): ?array
    {
        if ($titre === null) {
            return null;
        }

        return [
            'nom' => $titre->getNom(),
            'niveau_min' => $titre->getNiveauMin(),
        ];
    }
}
