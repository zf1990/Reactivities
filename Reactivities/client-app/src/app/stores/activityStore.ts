import {
  observable,
  action,
  computed,
  configure,
  makeAutoObservable,
  runInAction,
  makeObservable,
} from "mobx";
import { createContext, SyntheticEvent } from "react";
import agent from "../api/agent";
import { IActivity } from "../models/activity";

configure({ enforceActions: "always" });

class ActivityStore {
  activityRegistry = new Map();
  activities: IActivity[] = [];
  loadingInitial = false;
  selectedActivity: IActivity | undefined;
  editMode = false;
  submitting = false;
  target = "";

  constructor() {
    //makeAutoObservable(this);
    makeObservable(this, {
      activityRegistry: observable,
      activities: observable,
      loadingInitial: observable,
      selectedActivity: observable,
      editMode: observable,
      submitting: observable,
      target: observable,
      activitiesByDate: computed,
      loadActivities: action,
      deleteActivity: action,
      createActivity: action,
      openCreateForm: action,
      openEditForm: action,
      cancelSelectedActivity: action,
      cancelFormOpen: action,
      editActivity: action,
      selectActivity: action,
    });
  }

  get activitiesByDate() {
    return Array.from(this.activityRegistry.values()).sort(
      (a, b) => Date.parse(a.date) - Date.parse(b.date)
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
      console.log("Oh fuck, something went wrong." + err);
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

  createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.selectedActivity = activity;
        this.editMode = false;
        this.submitting = false;
      });
    } catch (err) {
      runInAction(() => (this.submitting = false));
      console.log("Oh fuck, something went wrong." + err);
    }
  };

  openCreateForm = () => {
    this.editMode = true;
    this.selectedActivity = undefined;
  };

  openEditForm = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id);
    this.editMode = true;
  };

  cancelSelectedActivity = () => {
    this.selectedActivity = undefined;
  };

  cancelFormOpen = () => {
    this.editMode = false;
  };

  editActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.update(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.selectedActivity = activity;
        this.editMode = false;
        this.submitting = false;
      });
    } catch (err) {
      runInAction(() => (this.submitting = false));
    }
  };

  selectActivity = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id);
    this.editMode = false;
    console.log("Select activity method is triggered");
  };
}

export default createContext(new ActivityStore());
