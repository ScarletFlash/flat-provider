import {
  ComponentProps,
  ComponentType,
  createElement,
  FC,
  JSX,
  JSXElementConstructor,
  PropsWithChildren,
  ReactNode
} from 'react';

/** @internal */
type ComponentPropsWithoutChildren<C extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> = Omit<
  ComponentProps<C>,
  'children'
>;

/**
 * @internal
 *
 * @description
 * A container for a component and its props, used for rendering a layout.
 */
interface ProviderWithProps<P = any, C extends ComponentType<P> = ComponentType<P>> {
  component: C;
  props: ComponentPropsWithoutChildren<C>;
}

/**
 * @description
 * A type for a regular component's children, inherited from `PropsWithChildren` for handling potential React API changes.
 */
type Children = Pick<PropsWithChildren, 'children'>['children'];

export class FlatProvider {
  readonly #providers: ProviderWithProps[] = [];

  public append(component: FC): this;
  public append<P extends PropsWithChildren>(component: FC<P>, props: Omit<P, 'children'>): this;
  /** @internal */
  public append<P extends PropsWithChildren, C extends ComponentType<P>>(
    component: C,
    props?: ComponentPropsWithoutChildren<C>
  ): this {
    this.#providers.push({
      component,
      props: props ?? {}
    });
    return this;
  }

  public getLayout(children?: Children): ReactNode {
    return this.#providers.reduceRight(
      (latestChild: ReactNode, { component, props }: ProviderWithProps) => createElement(component, props, latestChild),
      children
    );
  }

  public static append(component: FC): FlatProvider;
  public static append<P extends PropsWithChildren>(component: FC<P>, props: Omit<P, 'children'>): FlatProvider;
  /** @internal */
  public static append<P extends PropsWithChildren, C extends ComponentType<P>>(
    component: C,
    props?: ComponentPropsWithoutChildren<C>
  ): FlatProvider;
  /** @internal */
  public static append(component: any, props?: any): FlatProvider {
    return new FlatProvider().append(component, props);
  }

  public static getLayout(children?: Children): ReactNode {
    return new FlatProvider().getLayout(children);
  }
}
