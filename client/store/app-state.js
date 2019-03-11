import { observable, computed, action } from 'mobx'

export default class AppState {
  constructor({ count, name } = { count: 0, name: 'hutchins' }) {
    this.count = count
    this.name = name
  }

  @observable count

  @observable name

  @computed get msg() {
    return `${this.name} say count is ${this.count}`
  }

  @action add() {
    this.count += 1
  }

  @action changeName(name) {
    this.name = name
  }
  // 为服务端渲染提供方法来获取到客户端当时的数据

  toJson() {
    return {
      count: this.count,
      name: this.name
    }
  }
}
