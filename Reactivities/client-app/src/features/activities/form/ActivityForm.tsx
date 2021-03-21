import React, { FormEvent, useContext, useEffect, useState } from "react";
import { Button, Form, Grid, Segment } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";
import { v4 as uuid } from "uuid";
import ActivityStore from "../../../app/stores/activityStore";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";
import { useStore } from "../../../app/stores/store";

interface DetailParams {
  id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history,
}) => {
  const { activityStore } = useStore();
  const {
    createActivity,
    editActivity,
    submitting,
    activity: initialFormState,
    loadActivity,
    clearActivity,
  } = activityStore;

  const [activity, setActivity] = useState<IActivity>({
    id: "",
    title: "",
    category: "",
    description: "",
    date: "",
    city: "",
    venue: "",
  });

  useEffect(() => {
    if (match.params.id && activity.id.length === 0) {
      loadActivity(match.params.id).then(
        () => initialFormState && setActivity(initialFormState)
      );
    }

    return () => {
      clearActivity();
    };
  }, [
    loadActivity,
    clearActivity,
    match.params.id,
    initialFormState,
    activity.id.length,
  ]);

  const handleSubmit = () => {
    if (activity.id.length === 0) {
      let newActivity = {
        ...activity,
        id: uuid(),
      };
      createActivity(newActivity).then(() =>
        history.push(`/activities/${newActivity.id}`)
      );
    } else {
      editActivity(activity).then(() =>
        history.push(`/activities/${activity.id}`)
      );
    }
  };

  const handleInputChange = (
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.currentTarget;
    setActivity({ ...activity, [name]: value });
  };

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          <Form onSubmit={handleSubmit}>
            <Form.Input
              placeholder="Title"
              value={activity.title}
              name="title"
              onChange={handleInputChange}
            />
            <Form.TextArea
              rows={2}
              placeholder="Description"
              name="description"
              value={activity.description}
              onChange={handleInputChange}
            />
            <Form.Input
              placeholder="Category"
              name="category"
              value={activity.category}
              onChange={handleInputChange}
            />
            <Form.Input
              type="datetime-local"
              placeholder="Date"
              name="date"
              value={activity.date}
              onChange={handleInputChange}
            />
            <Form.Input
              placeholder="City"
              name="city"
              value={activity.city}
              onChange={handleInputChange}
            />
            <Form.Input
              placeholder="Venue"
              name="venue"
              value={activity.venue}
              onChange={handleInputChange}
            />
            <Button
              floated="right"
              positive
              type="submit"
              content="Submit"
              loading={submitting}
            />
            <Button
              floated="right"
              standard
              type="button"
              content="Cancel"
              onClick={() => history.push("/activities")}
            />
          </Form>
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityForm);
