import React from 'react'
import IconButton from 'material-ui/IconButton'
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar'
import NavigationMenu from 'material-ui/svg-icons/navigation/menu'

import SearchBox from './SearchBox.jsx'
import UserMenu from './UserMenu.jsx'


class TopBar extends React.Component {
  constructor(props) {
    super(props)
  }

  _toggleSideNav() {

  }

  render() {
    return (
      <Toolbar>
        <IconButton
          onClick={this.props.onHomeButtonClick}
        >
          <NavigationMenu />
        </IconButton>
        <ToolbarTitle
          text="Topogram"
        />
        <ToolbarGroup>
          <SearchBox />
        </ToolbarGroup>
        <ToolbarSeparator />
        <UserMenu />
      </Toolbar>
    )
  }
}

export default TopBar
