<?php

namespace App\Service;

use App\Repository\NoteRepository;

class Calculate {
    private NoteRepository $noteRepository;

    public function __construct(NoteRepository $noteRepository)
    {
        $this->noteRepository = $noteRepository;
    }

    /*
     * Prend les notes de chaque matière et retourne la moyenne générale coefficientée
     */
    public function moyenneGenerale(): ?int
    {
        $notes = $this->noteRepository->findAll();

        $marks = null;
        foreach ($notes as $note){
            $marks[] = [
                "mark" => $note->getNote(),
                "coef" => $note->getMatiere()->getCoef()
            ];
        }

        return $this->moyenneCoef($marks);
    }

    /*
     * Prend en paramètre autant de notes que l'on souhaite et retourne une moyenne arrondie à 10^-2
     */
    private function moyenneCoef(?array $marks): ?float
    {
        //dans le cas où le professeur n'aurait pas entré de notes
        if($marks === null){
            return null;
        }

        $totalMark = $coefTot = 0;
        foreach($marks as $mark)
        {
            $totalMark += $mark['mark'] * $mark['coef'];
            $coefTot += $mark['coef'];
        }
        $moyenne = $totalMark / $coefTot;

        return round($moyenne, 2);
    }
}