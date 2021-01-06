import React from "react";
import { Button, Container, Menu } from "semantic-ui-react";

interface IProps {
  openCreateForm: () => void;
}

export const NavBar: React.FC<IProps> = ({ openCreateForm }) => {
  return (
    <div>
      <Menu fixed="top" inverted>
        <Container>
          <Menu.Item header>
            <img
              src="/assets/logo.png"
              alt="logo"
              style={{ marginRight: "10px" }}
            ></img>
            Reactivities
          </Menu.Item>
          <Menu.Item name="Activities"></Menu.Item>
          <Menu.Item>
            <Button
              positive
              content="Create Activity"
              onClick={openCreateForm}
            />
          </Menu.Item>
        </Container>
      </Menu>
    </div>
  );
};
