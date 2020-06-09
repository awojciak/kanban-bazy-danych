# Routy

## pobierające dane

1. /sprintForTeam/:id - pobiera dane dla danej tablicy
2. /getChooseFormData - pobiera dane wykorzystywane w formularzu wyboru tablic
3. /getTabId/:sprint/:team - pobiera id tablicy na podstawie id sprintu i zespołu
4. /backlog/:id - pobiera dane backlogu
5. /task/:id - pobiera dane zadania
6. /tasksForBacklog/:id - pobiera zadania dla daneggo backlogu
7. /taggedTasks - pobiera taski zawierające dane tagi
8. /taggedBacklogs - pobiera backlogi zawierające dane tagi
9. /person/:id - pobiera dane osoby
10. /team/:id - pobiera dane zespołu
11. /allPeople - pobiera dane wszystkich pracowników
12. /tasksForPerson/:id - pobiera taski, do których przyporządkowana jest pewna osoba

## wstawiające dane
1. /newTask - tworzy nowe zadanie
2. /newSprint - tworzy nowy sprint oraz tablice dla wszystkich zespołów
3. /newBacklog - tworzy nowy backlog
4. /newPerson - tworzy nowego pracownika
5. /newTeam - tworzy nowy zespół

## edytujące dane
1. /updateTask - aktualizuje szczegóły danego zadania
2. /updateBacklog - aktualizuje szczegóły danego backlogu
3. /setGoal - ustawia cel dla danego sprintu

## usuwające dane
1. /deleteTask/:id - usuwa dane zadanie
2. /deleteBacklog/:id - usuwa dany backlog