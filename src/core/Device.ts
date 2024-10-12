export type DeviceArguments = {
  name       : string
}

export class Device {
  private protectedName       : string;
  private protectedValue = 0;

  constructor({ name }: DeviceArguments) {
    this.protectedName = name;
  }

  incrementValue(gap:number) {
    this.protectedValue += gap;
  }

  setValue(value:number) {
    this.protectedValue = value;
  }

  get name() {
    return this.protectedName;
  }

  get value() {
    return this.protectedValue;
  }
}