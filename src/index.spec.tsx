import "@testing-library/jest-dom";
import { render, screen, cleanup } from "@testing-library/react";
import {
  Context,
  createContext,
  FC,
  PropsWithChildren,
  useContext,
} from "react";
import { Multiprovider } from "./index";

const testId: string = "test-wrapper";

it("should return children as is if no providers are set", () => {
  cleanup();

  const expectedInnerHtml: string = "Child";

  render(
    <section data-testid={testId}>
      {Multiprovider.getLayout(<>{expectedInnerHtml}</>)}
    </section>
  );

  const container: HTMLElement = screen.getByTestId(testId);
  expect(container.childNodes).toHaveLength(1);
  expect(container.innerHTML).toBe(expectedInnerHtml);
});

it("should render React context providers in the correct order", () => {
  cleanup();

  const providersCount: number = 10;

  const indexAttributeName: string = "data-context-index";

  const providers: FC[] = Array.from(
    { length: providersCount },
    (_, index: number) => {
      const context: Context<number> = createContext(index);

      const InternalComponent: FC<PropsWithChildren> = ({
        children,
      }: PropsWithChildren) => {
        const contextIndex: number = useContext(context);
        return (
          <section {...{ [indexAttributeName]: contextIndex }}>
            {children}
          </section>
        );
      };

      return ({ children }: PropsWithChildren) => {
        return (
          <context.Provider value={index}>
            <InternalComponent>{children}</InternalComponent>
          </context.Provider>
        );
      };
    }
  );

  render(
    <section data-testid={testId}>
      {providers
        .reduce(
          (multiproviderRef: Multiprovider, currentProvider: FC) =>
            multiproviderRef.append(currentProvider),
          new Multiprovider()
        )
        .getLayout()}
    </section>
  );

  const providerInternalComponents: NodeListOf<Element> = screen
    .getByTestId(testId)
    .querySelectorAll(`section[${indexAttributeName}]`);
  expect(providerInternalComponents).toHaveLength(providersCount);

  providerInternalComponents.forEach(
    (providerInternalComponent: Element, index: number) => {
      expect(providerInternalComponent.getAttribute(indexAttributeName)).toBe(
        String(index)
      );
    }
  );
});

it("should correctly handle props", () => {
  cleanup();

  const ComponentWithProps: FC<PropsWithChildren<{ payload: object }>> = ({
    payload,
  }) => {
    return <section>With props: {JSON.stringify(payload)}</section>;
  };

  const ComponentWithoutProps: FC = () => {
    return <section>No props</section>;
  };

  const timestamp: number = Date.now();

  render(
    <section data-testid={testId}>
      {Multiprovider.append(ComponentWithProps, {
        payload: { timestamp },
      })
        .append(ComponentWithoutProps)
        .getLayout()}
    </section>
  );

  const container: HTMLElement = screen.getByTestId(testId);

  expect(container.outerHTML).toBe(
    `<section data-testid="${testId}"><section>With props: {"timestamp":${timestamp}}</section></section>`
  );
});
