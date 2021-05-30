<?php

namespace App\Service;

use App\Entity\Matiere as MatiereEntity;
use App\Form\MatiereFormType;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\HttpFoundation\Request;

class Matiere extends AbstractFormService{

    public function formManager(Request $request, $formType = null, $entity = null): FormInterface
    {
        return parent::formManager($request, MatiereFormType::class, new MatiereEntity());
    }

    protected function submitAndValid(FormInterface $form): void
    {
        $matiere = new MatiereEntity();
        if ($form->isSubmitted() && $form->isValid()) {
            $matiere
                ->setNom($form->get('nom')->getData())
                ->setCoef($form->get('coef')->getData());

            $this->em->persist($matiere);
            $this->em->flush();
        }
    }
}