<?php

namespace App\Form;

use App\Entity\Matiere;
use App\Entity\Note;
use App\Repository\MatiereRepository;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class NoteFormType extends AbstractType
{
    private MatiereRepository $matiereRepository;

    public function __construct(MatiereRepository $matiereRepository)
    {
        $this->matiereRepository = $matiereRepository;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('note')
                ->add('matiere', ChoiceType::class, [
                    'choices' => $this->matiereRepository->getAllNom(),
                ]);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Note::class,
        ]);
    }
}
