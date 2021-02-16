import APIManager from './APIManager'

export const getUserExercises = async () => {
    const creds = JSON.parse(localStorage.getItem("credentials"));
    let exercises = [];

    await APIManager.get(
      `workouts?userId=${creds.loggedInUserId}&_embed=exercises`
    ).then((workoutsRes) => {
      workoutsRes.forEach((workout) => {
        workout.exercises.forEach((exercise) => {
          const modifiedExercise = exercise;
          modifiedExercise.workoutName = workout.name;
          exercises.push(modifiedExercise);
        });
      });
    });
    const exercisesSet = new Set(exercises);
    exercises = Array.from(exercisesSet);
    exercises = exercises.sort((a, b) => {
        return a.name - b.name
    });
    return exercises;
};
