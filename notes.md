## TODO

- [ ] Create a way to have X warm up sets in linear progression (but should be all)
- [ ] Create double progression
- [ ] Create progression that requires state. 5/3/1 suggested but IDK what that is




## General Thoughts

- I want to fully understand this process of creating a progression system with
    all the types of progression I want no matter how complex. This should give 
    me the ability to rewrite the progression system for DBA.
- I need to learn of the different progression systems there are for lifting. There
    are all kinds of things I need to know. There are state based progression systems
    that would make things so in depth, complex, but wonderful. (Ex. 4 week - base/volume/recovery/retest)
- We can start to make changes to prescribe a series of workouts for multiple exercises
    out of a single value and that would then be able to trigger updates after completions
    are registered compared to the prescribedSet[]'s.
    - Assuming we are not trying to figure out scheduling or anything and we are just generating
        the workouts, we would need to know a lot of information. What exercises are to be included?
        Is it just a copy of the previous workouts but run it through the progression algorithm X times?
        If we are not doing that, how do other exercises get selected? How do we know they are exercising
        the same things as the ones that we did last corresponding workout?
    - If we are just creating a progression system for an exercise if that exercise is being prescribed,
        we have to accomodate user based strengh increasing if that exercise isn't used for 6 months but
        they bench 50 lbs more, their incline bench has probably increased as well and we wouldn't want
        the other exercises to lag behind because they have not been doing them. It would just waste time.
- I want to add the ability to adjust prescribedSets. This would come from an evaluation of training history
    (in total as well as those particular muscles used in other workouts/exercises recently) and an optional
    questionnaire every day. 
    - This can be pulled from my production data of my personal training. I can put that through an AI that
        allows me to transcribe it to the correct format for data input.



## Learning

- 






## Questions 

- How do I correctly add workout state to these progression systems? Some of them need it
    but others don't so it should be an optional value but we would need to handle that.
- "Discriminated Union and factory so config can be serialized"... WTF does that mean?




