<?php

namespace App\EventListener;

use App\Entity\Post;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Doctrine\ORM\Events;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\EntityManagerInterface;

#[AsEntityListener(event: Events::postPersist, method: 'postPersist', entity: Post::class)]
class PostListener
{
    public function __construct(private EntityManagerInterface $em) {}

    public function postPersist(Post $post): void
    {
        $user = $post->getUser();

        if ($user) {
            $user->addXp(10);

            $this->em->flush();
        }
    }
}
