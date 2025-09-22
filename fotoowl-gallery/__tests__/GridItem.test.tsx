// __tests__/GridItem.test.tsx
import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import GridItem from "../src/components/GridItem"; // Adjust the import path if necessary

describe("GridItem component", () => {
  const baseProps = {
    id: "1",
    title: "Lovely Photo",
    thumbnailUrl: "https://example.com/thumb.jpg",
    isFavorited: false,
    onPress: jest.fn(),
    onToggleFavorite: jest.fn(),
  };

  it("renders the title and image", () => {
    const { getByText, getByTestId } = render(<GridItem {...baseProps} />);
    // Check if the title is rendered
    expect(getByText("Lovely Photo")).toBeTruthy();
    // Check if the image has the correct testID
    expect(getByTestId("griditem-image")).toBeTruthy();
  });

  it("calls onPress when the touchable wrapper is pressed", () => {
    const { getByTestId } = render(<GridItem {...baseProps} />);
    // Check if the touchable wrapper has the correct testID
    const touchable = getByTestId("griditem-touchable");
    fireEvent.press(touchable);
    expect(baseProps.onPress).toHaveBeenCalled();
  });

  it("calls onToggleFavorite when the favorite button is pressed", () => {
    const { getByTestId } = render(<GridItem {...baseProps} />);
    // Check if the favorite button has the correct testID
    const favButton = getByTestId("griditem-fav-button");
    fireEvent.press(favButton);
    expect(baseProps.onToggleFavorite).toHaveBeenCalled();
  });

  it("renders the correct favorite icon based on isFavorited", () => {
    const { getByTestId, rerender } = render(<GridItem {...baseProps} />);
    const favButton = getByTestId("griditem-fav-button");

    // Initially not favorited
    expect(favButton.children[0].props.style.color).toBe("white");

    // Update props to favorited
    rerender(<GridItem {...baseProps} isFavorited={true} />);
    expect(favButton.children[0].props.style.color).toBe("red");
  });
});
