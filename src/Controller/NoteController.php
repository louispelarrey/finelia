<?php

namespace App\Controller;

use App\Service\Calculate;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Service\Matiere as MatiereService;
use App\Service\Note as NoteService;

class NoteController extends AbstractController
{
    private Calculate $calculService;
    private MatiereService $matiereService;
    private NoteService $noteService;

    public function __construct(Calculate $calculService, MatiereService $matiereService, NoteService $noteService)
    {
        $this->calculService = $calculService;
        $this->matiereService = $matiereService;
        $this->noteService = $noteService;
    }

    #[Route('/note', name: 'note')]
    public function index(Request $request): Response
    {
        $matiereForm = $this->matiereService->formManager($request);
        $noteForm = $this->noteService->formManager($request);

        return $this->render('note/index.html.twig', [
            'user' => $this->getUser(),
            'noteForm' => $noteForm->createView(),
            'matiereForm' => $matiereForm->createView(),
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
