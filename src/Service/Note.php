<?php

namespace App\Service;

use App\Entity\Note as NoteEntity;
use App\Form\NoteFormType;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\HttpFoundation\Request;

class Note extends AbstractFormService{

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
}