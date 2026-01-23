import React from "react";
import RequestState from "../shared/ui/RequestState/RequestState";

// A failed route chunk must leave navigation available and offer a fresh load.
export default class RouteErrorBoundary extends React.Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <RequestState
          error="This page could not be loaded. Please reload and try again."
          onRetry={() => window.location.reload()}
        />
      );
    }

    return this.props.children;
  }
}
