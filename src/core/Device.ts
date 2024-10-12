export type DeviceArguments = {
  name       : string
}

export class Device {
  private protectedName: string;
  private protectedValue = 0;
  private protectedContext:object | undefined;

  constructor({ name }: DeviceArguments) {
    this.protectedName = name;
  }

  incrementValue(gap:number) {
    this.protectedValue += gap;
  }

  setValue(value:number) {
    this.protectedValue = value;
  }

  setContext(context:object | undefined) {
    this.protectedContext = context;
  }

  get context() {
    return this.protectedContext;
  }

  get name() {
    return this.protectedName;
  }

  get value() {
    return this.protectedValue;
  }
}