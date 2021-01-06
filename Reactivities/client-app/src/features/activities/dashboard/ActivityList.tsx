import React from "react";
import { Item, Button, Label, Segment } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";

interface IProps {
  activities: IActivity[];
  selectActivity: (id: string) => void;
  handleDeleteActivity: (activity: IActivity) => void;
}

export const ActivityList: React.FC<IProps> = ({
  activities,
  selectActivity,
  handleDeleteActivity,
}) => {
  return (
    <Segment clearing>
      <Item.Group divided>
        {activities.map((activitiy) => (
          <Item key={activitiy.id}>
            <Item.Content>
              <Item.Header as="a">{activitiy.title}</Item.Header>
              <Item.Meta>{activitiy.date}</Item.Meta>
              <Item.Description>
                <div>{activitiy.description}</div>
                <div>
                  {activitiy.city}, {activitiy.venue}
                </div>
              </Item.Description>
              <Item.Extra>
                <Button
                  onClick={() => selectActivity(activitiy.id)}
                  floated="right"
                  content="View"
                  color="blue"
                ></Button>
                <Button
                  onClick={() => handleDeleteActivity(activitiy)}
                  floated="right"
                  content="Delete"
                  color="red"
                ></Button>
                <Label basic content={activitiy.category}></Label>
              </Item.Extra>
            </Item.Content>
          </Item>
        ))}
      </Item.Group>
    </Segment>
  );
};
