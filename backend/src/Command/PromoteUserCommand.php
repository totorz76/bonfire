<?php

namespace App\Command;

use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:promote-user',
    description: 'Promouvoir un utilisateur en administrateur (ROLE_ADMIN)',
)]
class PromoteUserCommand extends Command
{
    public function __construct(
        private UserRepository $userRepository,
        private EntityManagerInterface $em,
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this->addArgument('email', InputArgument::REQUIRED, 'Email de l\'utilisateur');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $email = $input->getArgument('email');

        $user = $this->userRepository->findOneBy(['email' => $email]);

        if (!$user) {
            $io->error(sprintf('Aucun utilisateur trouvé avec l\'email "%s".', $email));

            return Command::FAILURE;
        }

        if (in_array('ROLE_ADMIN', $user->getRoles(), true)) {
            $io->warning(sprintf('%s est déjà administrateur.', $user->getPseudo()));

            return Command::SUCCESS;
        }

        $user->setRoles(['ROLE_ADMIN']);

        $this->em->flush();

        $io->success(sprintf('%s (%s) est maintenant administrateur.', $user->getPseudo(), $email));

        return Command::SUCCESS;
    }
}
