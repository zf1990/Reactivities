import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Item, Button, Label, Segment } from "semantic-ui-react";
import ActivityStore from "../../../app/stores/activityStore";

const ActivityList: React.FC = () => {
  const {
    activitiesByDate,
    selectActivity,
    deleteActivity,
    submitting,
    target,
  } = useContext(ActivityStore);
  return (
    <Segment clearing>
      <Item.Group divided>
        {activitiesByDate.map((activity) => (
          <Item key={activity.id}>
            <Item.Content>
              <Item.Header as="a">{activity.title}</Item.Header>
              <Item.Meta>{activity.date}</Item.Meta>
              <Item.Description>
                <div>{activity.description}</div>
                <div>
                  {activity.city}, {activity.venue}
                </div>
              </Item.Description>
              <Item.Extra>
                <Button
                  onClick={() => selectActivity(activity.id)}
                  floated="right"
                  content="View"
                  color="blue"
                ></Button>
                <Button
                  name={activity.id}
                  onClick={(event) => deleteActivity(event, activity.id)}
                  loading={target === activity.id && submitting}
                  floated="right"
                  content="Delete"
                  color="red"
                ></Button>
                <Label basic content={activity.category}></Label>
              </Item.Extra>
            </Item.Content>
          </Item>
        ))}
      </Item.Group>
    </Segment>
  );
};

export default observer(ActivityList);
