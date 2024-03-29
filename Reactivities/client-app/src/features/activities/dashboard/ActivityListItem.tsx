import { Link } from "react-router-dom";
import { Item, Button, Segment, Icon } from "semantic-ui-react";
import React from "react";
import { IActivity } from "../../../app/models/activity";
import format from "date-fns/format";

export const ActivityListItem: React.FC<{ activity: IActivity }> = ({
  activity,
}) => {
  return (
    <Segment.Group>
      <Segment>
        <Item.Group>
          <Item>
            <Item.Image size="tiny" circule src="/assets/user.png" />
            <Item.Content>
              <Item.Header as="a">{activity.title}</Item.Header>
              <Item.Description>Hosted by Zhou</Item.Description>
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <Segment>
        <Icon name="clock" /> {format(activity.date!, "yyyy-MM-dd h:mm aa")}
        <Icon name="marker" /> {activity.venue}, {activity.city}
      </Segment>
      <Segment secondary>Attendees will go here</Segment>
      <Segment clearing>
        <span>{activity.description}</span>
        <Button
          as={Link}
          to={`/activities/${activity.id}`}
          floated="right"
          content="View"
          color="blue"
        ></Button>
      </Segment>
    </Segment.Group>
  );
};
