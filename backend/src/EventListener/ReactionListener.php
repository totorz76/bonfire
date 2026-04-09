<?php

namespace App\EventListener;

use App\Entity\Reaction;
use Doctrine\ORM\Events;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\EntityManagerInterface;

#[AsEntityListener(event: Events::postPersist, method: 'postPersist', entity: Reaction::class)]
class ReactionListener
{
    public function __construct(private EntityManagerInterface $em) {}

    public function postPersist(Reaction $reaction): void
    {
        $postOwner = $reaction->getPost()->getUser();

        if ($reaction->getUser() !== $postOwner) {
            $postOwner->addXp(5);

            $this->em->persist($postOwner);
            $this->em->flush();
        }
    }
}
