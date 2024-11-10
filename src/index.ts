import {
  ComponentProps,
  ComponentType,
  createElement,
  FC,
  JSX,
  JSXElementConstructor,
  PropsWithChildren,
  ReactNode,
} from "react";

type ComponentPropsWithoutChildren<
  C extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>
> = Omit<ComponentProps<C>, "children">;

interface ProviderWithProps<
  P = any,
  C extends ComponentType<P> = ComponentType<P>
> {
  component: C;
  props: ComponentPropsWithoutChildren<C>;
}

type Children = Pick<PropsWithChildren, "children">["children"];

export class FlatProvider {
  readonly #providers: ProviderWithProps[] = [];

  public append(component: FC): this;
  public append<P extends PropsWithChildren>(
    component: FC<P>,
    props: Omit<P, "children">
  ): this;
  public append<P extends PropsWithChildren, C extends ComponentType<P>>(
    component: C,
    props?: ComponentPropsWithoutChildren<C>
  ): this {
    this.#providers.push({
      component,
      props: props ?? {},
    });
    return this;
  }

  public getLayout(children?: Children): ReactNode {
    return this.#providers.reduceRight(
      (latestChild: ReactNode, { component, props }: ProviderWithProps) =>
        createElement(component, props, latestChild),
      children
    );
  }

  public static append(component: FC): FlatProvider;
  public static append<P extends PropsWithChildren>(
    component: FC<P>,
    props: Omit<P, "children">
  ): FlatProvider;
  public static append<P extends PropsWithChildren, C extends ComponentType<P>>(
    component: C,
    props?: ComponentPropsWithoutChildren<C>
  ): FlatProvider;
  public static append(component: any, props?: any): FlatProvider {
    return new FlatProvider().append(component, props);
  }

  public static getLayout(children?: Children): ReactNode {
    return new FlatProvider().getLayout(children);
  }
}
