package actor

import akka.actor.Actor
import play.api.libs.json.{Json, JsValue}
import play.api.libs.iteratee.{Enumerator, Concurrent}
import actor.DataMerger.{RegisterConsumerConfirmation, OrientationChangeEvent, RegisterConsumer}
import json.JsonFormats._

object DataMerger {
  case class RegisterConsumerConfirmation(enumerator: Enumerator[JsValue])
  case class RegisterConsumer()
  case class OrientationChangeEvent(device: String, data: OrientationChangeData)
  case class OrientationChangeData(alpha: Double, beta: Double, gamma: Double)
}

class DataMerger extends Actor {

  val (dataEnumerator, dataChannel) = Concurrent.broadcast[JsValue]

  def receive = {

    case RegisterConsumer() =>
      sender ! RegisterConsumerConfirmation(dataEnumerator)

    case e: OrientationChangeEvent =>
      broadCastMessage(e)
  }

  def broadCastMessage(event: OrientationChangeEvent) = dataChannel.push(Json.toJson(event))
}
