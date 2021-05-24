<?php

namespace App\Controller;

use App\Entity\Note;
use App\Form\NoteFormType;
use App\Service\Calculate;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class NoteController extends AbstractController
{
    private Calculate $calculService;

    public function __construct(Calculate $calculService)
    {
        $this->calculService = $calculService;
    }

    #[Route('/note', name: 'note')]
    public function index(): Response
    {
        $note = new Note();
        $form = $this->createForm(NoteFormType::class, $note);

        return $this->render('note/index.html.twig', [
            'user' => $this->getUser(),
            'noteForm' => $form->createView(),
        ]);
    }

    #[Route('/note/add', name: 'noteAdd')]
    public function add(): Response
    {
        $marks = [
            0 => [
                'mark' => 15,
                'coef' => 0.8
            ],
            1 => [
                'mark' => 8,
                'coef' => 2
            ],
            2 => [
                'mark' => 13,
                'coef' => 0.5
            ],
        ];

        return $this->render('note/index.html.twig', [
            'moy' => $this->calculService->moyenneCoef($marks),

        ]);
    }

    #[Route('/note/delete', name: 'noteDelete')]
    public function delete(): Response
    {
        return $this->render('note/index.html.twig', [
        ]);
    }
}
