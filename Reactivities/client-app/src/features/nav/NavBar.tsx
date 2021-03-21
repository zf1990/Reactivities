import { observer } from "mobx-react-lite";
import React from "react";
import { NavLink } from "react-router-dom";
import { Button, Container, Menu } from "semantic-ui-react";

export const NavBar: React.FC = () => {
  return (
    <div>
      <Menu fixed="top" inverted>
        <Container>
          <Menu.Item header as={NavLink} exact to="/">
            <img
              src="/assets/logo.png"
              alt="logo"
              style={{ marginRight: "10px" }}
            ></img>
            Reactivities
          </Menu.Item>
          <Menu.Item
            name="Activities"
            as={NavLink}
            to="/activities"
          ></Menu.Item>
          <Menu.Item name="Errors" as={NavLink} to="/errors"></Menu.Item>
          <Menu.Item>
            <Button
              as={NavLink}
              to="/createActivity"
              positive
              content="Create Activity"
            />
          </Menu.Item>
        </Container>
      </Menu>
    </div>
  );
};

export default observer(NavBar);
