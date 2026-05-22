<?php

namespace App\Repository;

use App\Entity\Titre;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Titre>
 */
class TitreRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Titre::class);
    }

    public function findForLevel(int $level): ?Titre
    {
        return $this->createQueryBuilder('t')
            ->where('t.niveau_min <= :level')
            ->setParameter('level', $level)
            ->orderBy('t.niveau_min', 'DESC')
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function findNextForLevel(int $level): ?Titre
    {
        return $this->createQueryBuilder('t')
            ->where('t.niveau_min > :level')
            ->setParameter('level', $level)
            ->orderBy('t.niveau_min', 'ASC')
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
