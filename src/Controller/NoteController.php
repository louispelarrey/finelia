<?php

namespace App\Controller;

use App\Service\Calculate;
use App\Service\Datatable;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Service\Matiere as MatiereService;
use App\Service\Note as NoteService;

#[Route('/note', name: 'note')]
class NoteController extends AbstractController
{
    private Calculate $calculService;
    private MatiereService $matiereService;
    private NoteService $noteService;
    private Datatable $datatable;

    public function __construct(Calculate $calculService, MatiereService $matiereService, NoteService $noteService,
                                Datatable $datatable)
    {
        $this->calculService = $calculService;
        $this->matiereService = $matiereService;
        $this->noteService = $noteService;
        $this->datatable = $datatable;
    }

    #[Route('/list', name: 'List', methods: ['GET', 'POST'])]
    public function index(Request $request): Response
    {
        $table = $this->datatable->noteDatatable($request, $this->getUser());
        if ($table->isCallback()) {
            return $table->getResponse();
        }

        return $this->render('note/view.html.twig', [
            'datatable' => $table,
            'user' => $this->getUser(),
            'moyenneGenerale' => $this->calculService->moyenneGenerale(),
        ]);
    }

    #[Route('/add', name: 'Add', methods: ['GET', 'POST'])]
    public function add(Request $request): Response
    {
        $matiereForm = $this->matiereService->formManager($request);
        $noteForm = $this->noteService->formManager($request);

        return $this->render('note/index.html.twig', [
            'user' => $this->getUser(),
            'noteForm' => $noteForm->createView(),
            'matiereForm' => $matiereForm->createView(),
        ]);
    }
}
