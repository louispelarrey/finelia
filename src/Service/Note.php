<?php

namespace App\Service;

use App\Entity\Note as NoteEntity;
use App\Form\NoteFormType;
use App\Repository\MatiereRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Form\FormFactoryInterface;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\Matiere as MatiereEntity;

class Note extends AbstractFormService{

    private MatiereRepository $matiereRepository;

    public function __construct(MatiereRepository $matiereRepository, FormFactoryInterface $formInterface, EntityManagerInterface $em)
    {
        parent::__construct( $formInterface, $em);
        $this->matiereRepository = $matiereRepository;
    }
    
    public function formManager(Request $request, $formType = null, $entity = null): FormInterface
    {
        return parent::formManager($request, NoteFormType::class, new NoteEntity());
    }

    protected function submitAndValid(FormInterface $form): void
    {
        $note = new NoteEntity();
        if ($form->isSubmitted() && $form->isValid()) {
            $note
                ->setMatiere($form->get('matiere')->getData())
                ->setNote($form->get('note')->getData());

            $this->em->persist($note);
            $this->em->flush();
        }
    }

    private function getMatiere(int $idMatiere): MatiereEntity
    {
        return $this->matiereRepository->find($idMatiere);
    }
}