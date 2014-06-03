package actor

import akka.actor.Actor
import play.api.libs.json.{Json, JsValue}
import actor.StreamMergingActor.OrientationChangeEvent
import json.JsonFormats._
import play.api.libs.iteratee.Concurrent.Channel

object StreamMergingActor {
  case class OrientationChangeEvent(deviceInfo: String, deviceId: String, colour: Int, data: OrientationChangeData)
  case class OrientationChangeData(alpha: Double, beta: Double, gamma: Double)
}

class StreamMergingActor(dataChannel: Channel[JsValue]) extends Actor {

  def receive = {
    case e: OrientationChangeEvent =>
      println(self + e.toString)
      produceMessage(e)
  }

  def produceMessage(event: OrientationChangeEvent) = dataChannel.push(Json.toJson(event))
}
