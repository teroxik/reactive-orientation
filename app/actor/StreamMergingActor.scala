package actor

import akka.actor.Actor
import play.api.libs.json.{Json, JsValue}
import play.api.libs.iteratee.{Enumerator, Concurrent}
import actor.StreamMergingActor.{RegisterConsumerConfirmation, OrientationChangeEvent, RegisterConsumer}
import json.JsonFormats._

object StreamMergingActor {
  case class RegisterConsumerConfirmation(enumerator: Enumerator[JsValue])
  case class RegisterConsumer()

  case class OrientationChangeEvent(device: String, colour: Int, data: OrientationChangeData)
  case class OrientationChangeData(alpha: Double, beta: Double, gamma: Double)
}

class StreamMergingActor extends Actor {

  val (dataEnumerator, dataChannel) = Concurrent.broadcast[JsValue]

  def receive = {
    case RegisterConsumer() =>
      sender ! RegisterConsumerConfirmation(dataEnumerator)

    case e: OrientationChangeEvent =>
      println(e)
      produceMessage(e)
  }

  def produceMessage(event: OrientationChangeEvent) = dataChannel.push(Json.toJson(event))
}
