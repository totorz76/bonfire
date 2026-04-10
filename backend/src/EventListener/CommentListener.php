<?php

namespace App\EventListener;

use App\Entity\Comment;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\Events;
use Doctrine\ORM\EntityManagerInterface;

#[AsEntityListener(
    event: Events::postPersist,
    method: 'postPersist',
    entity: Comment::class
)]
class CommentListener
{
    public function __construct(
        private EntityManagerInterface $em
    ) {}

    public function postPersist(Comment $comment): void
    {
        $commenter = $comment->getUser();
        $postOwner = $comment->getPost()?->getUser();

        if (!$commenter) {
            return;
        }

        $commenter->addXp(2);

        if ($postOwner && $postOwner !== $commenter) {
            $postOwner->addXp(1);
        }

        // IMPORTANT : flush explicite
        $this->em->flush();
    }
}
