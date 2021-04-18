import { observer } from "mobx-react-lite";
import React, { Fragment } from "react";
import { Item, Label } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";
import { useStore } from "../../../app/stores/store";
import { ActivityListItem } from "./ActivityListItem";

const ActivityList: React.FC = () => {
  const { activityStore } = useStore();
  const { groupActivitiesByDate } = activityStore;

  return (
    <Fragment>
      {groupActivitiesByDate.map(([group, activities]) => (
        <Fragment key={group}>
          <Label size="large" color="blue">
            {group}
          </Label>

          <Item.Group divided>
            {activities.map((activity: IActivity) => (
              <ActivityListItem key={activity.id} activity={activity} />
            ))}
          </Item.Group>
        </Fragment>
      ))}
    </Fragment>
  );
};

export default observer(ActivityList);
