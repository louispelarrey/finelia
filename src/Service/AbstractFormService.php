<?php

namespace App\Service;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Form\FormFactoryInterface;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\HttpFoundation\Request;

abstract class AbstractFormService {

    private FormFactoryInterface $formInterface;
    protected EntityManagerInterface $em;

    public function __construct(FormFactoryInterface $formInterface, EntityManagerInterface $em)
    {
        $this->formInterface = $formInterface;
        $this->em = $em;
    }

    protected function formManager(Request $request, $formType, $entity): FormInterface
    {
        $form = $this->generateForm($formType, $entity);
        $form->handleRequest($request);

        $this->submitAndValid($form);

        return $form;
    }

    private function generateForm(string $formType, $entity): FormInterface
    {
        return $this->formInterface->create($formType, $entity);
    }

    abstract protected function submitAndValid(FormInterface $form);
}