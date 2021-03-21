import {
  observable,
  action,
  computed,
  configure,
  runInAction,
  makeObservable,
} from "mobx";
import { createContext, SyntheticEvent } from "react";
import agent from "../api/agent";
import { IActivity } from "../models/activity";

configure({ enforceActions: "always" });

export default class ActivityStore {
  activityRegistry = new Map();
  activities: IActivity[] = [];
  loadingInitial = false;
  activity: IActivity | null = null;
  submitting = false;
  target = "";

  constructor() {
    //makeAutoObservable(this);
    makeObservable(this, {
      activityRegistry: observable,
      activities: observable,
      loadingInitial: observable,
      activity: observable,
      submitting: observable,
      target: observable,
      activitiesByDate: computed,
      loadActivities: action,
      deleteActivity: action,
      loadActivity: action,
      createActivity: action,
      clearActivity: action,
      editActivity: action,
    });
  }

  get activitiesByDate() {
    return this.groupActivitiesByDate(
      Array.from(this.activityRegistry.values())
    );
  }

  groupActivitiesByDate(activities: IActivity[]) {
    const sortedActivities = activities.sort(
      (a, b) => Date.parse(a.date) - Date.parse(b.date)
    );

    return Object.entries(
      sortedActivities.reduce((activities, activity) => {
        const date = activity.date.split("T")[0];
        activities[date] = activities[date]
          ? [...activities[date], activity]
          : [activity]; //if activities[date] exist, previous activities + current activity, othersie, just be activity/  return the activities
        return activities;
      }, {} as { [key: string]: IActivity[] })
    );
  }

  loadActivities = async () => {
    this.loadingInitial = true;
    try {
      const activities = await agent.Activities.list();
      runInAction(() => {
        activities.forEach((a: IActivity) => {
          a.date = a.date.split(".")[0];
          this.activityRegistry.set(a.id, a);
        });
      });
    } catch (err) {
      runInAction(() => {
        this.loadingInitial = false;
      });
    } finally {
      runInAction(() => (this.loadingInitial = false));
    }
  };

  deleteActivity = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.submitting = true;
    this.target = event.currentTarget.name;
    try {
      await agent.Activities.delete(id);
      runInAction(() => {
        this.activityRegistry.delete(id);
        this.submitting = false;
        this.target = "";
      });
    } catch (err) {
      runInAction(() => {
        this.submitting = false;
        this.target = "";
      });

      console.log("Oh fuck, something went wrong." + err);
    }
  };

  loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    if (activity) {
      this.activity = activity;
    } else {
      this.loadingInitial = true;
      try {
        activity = await agent.Activities.details(id);
        runInAction(() => {
          this.activity = activity;
          this.loadingInitial = false;
        });
      } catch (err) {
        console.log(
          "Oh fuck, something went wrong with fetching this activity..." + err
        );
        runInAction(() => (this.loadingInitial = false));
      }
    }
  };

  getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  };

  createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.activity = activity;
        this.submitting = false;
      });
    } catch (err) {
      runInAction(() => (this.submitting = false));
      console.log("Oh fuck, something went wrong." + err);
    }
  };

  clearActivity = () => {
    this.activity = null;
  };

  editActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.update(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.activity = activity;
        this.submitting = false;
      });
    } catch (err) {
      runInAction(() => (this.submitting = false));
    }
  };
}

//export default createContext(new ActivityStore());
