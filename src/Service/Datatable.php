<?php

namespace App\Service;

use Omines\DataTablesBundle\Adapter\Doctrine\ORMAdapter;
use Omines\DataTablesBundle\Column\TextColumn;
use Omines\DataTablesBundle\DataTableFactory;
use Symfony\Component\HttpFoundation\Request;
use Omines\DataTablesBundle\DataTable as DataTablesBundle;
use \App\Entity\Note;

class Datatable
{
    private DataTableFactory $dataTableFactory;

    public function __construct(DataTableFactory $dataTableFactory)
    {
        $this->dataTableFactory = $dataTableFactory;
    }

    public function noteDatatable(Request $request): DataTablesBundle
    {
        return $this->dataTableFactory->create()
            ->add('note', TextColumn::class, ['label' => 'Note'])
            ->add('matiere', TextColumn::class, [
                'label' => 'Matière',
                'field' => 'note.matiere'
            ])
            ->createAdapter(ORMAdapter::class, [
                'entity' => Note::class
            ])
            ->handleRequest($request);
    }
}