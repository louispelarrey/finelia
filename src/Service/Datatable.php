<?php

namespace App\Service;

use Doctrine\ORM\QueryBuilder;
use Omines\DataTablesBundle\Adapter\Doctrine\ORMAdapter;
use Omines\DataTablesBundle\Column\TextColumn;
use Omines\DataTablesBundle\DataTableFactory;
use Symfony\Component\HttpFoundation\Request;
use Omines\DataTablesBundle\DataTable as DataTablesBundle;
use \App\Entity\Note;
use Symfony\Component\Security\Core\User\UserInterface;

class Datatable
{
    private DataTableFactory $dataTableFactory;

    public function __construct(DataTableFactory $dataTableFactory)
    {
        $this->dataTableFactory = $dataTableFactory;
    }

    public function noteDatatable(Request $request, UserInterface $thisUser): DataTablesBundle
    {
        return $this->dataTableFactory->create()
            ->add('note', TextColumn::class, ['label' => 'Note'])
            ->add('matiere', TextColumn::class, [
                'label' => 'Matière',
                'field' => 'note.matiere'
            ])
            ->createAdapter(ORMAdapter::class, [
                'entity' => Note::class,
                'query' => function (QueryBuilder $builder) use ($thisUser) {
                    $builder
                        ->select('e')
                        ->from(Note::class, 'e')
                        ->where('e.user = :thisUser')
                        ->setParameter(':thisUser', $thisUser)
                    ;
                },
            ])
            ->handleRequest($request);
    }
}