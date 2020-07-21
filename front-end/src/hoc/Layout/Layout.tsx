import React, { Component, ReactNode } from 'react';

interface LayoutProps {
    children?: ReactNode;
}

interface LayoutState {}

class Layout extends Component<LayoutProps, LayoutState> {
    render() {
        return (
            <main>
                {/* side-menu, pop-up, error handling belongs here */}
                {this.props.children}
            </main>
        );
    }
}

export default Layout;
