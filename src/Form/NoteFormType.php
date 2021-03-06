<?php

namespace App\Form;

use App\Entity\Matiere;
use App\Entity\Note;
use App\Entity\User;
use Doctrine\ORM\EntityRepository;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class NoteFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder->add('note', NumberType::class, [
                    'scale' => 1,
                    'attr' => array(
                        'min' => 0,
                        'max' => 20,
                        'step' => '.1',
                    ),
                    'required' => false,
                    'html5' => true
                ])
                ->add('matiere', EntityType::class, [
                    'class' => Matiere::class,
                ])
                ->add('user', EntityType::class, [
                    'class' => User::class,
                    'query_builder' => function (EntityRepository $er) {
                        return $er->createQueryBuilder('u')
                            ->where('u.roles = :etudiant')
                            ->setParameter(':etudiant', '["ROLE_ETUDIANT"]')
                            ;
                    },
                ])
        ;

    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Note::class,
        ]);
    }
}
