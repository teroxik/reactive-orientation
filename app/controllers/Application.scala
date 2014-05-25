package controllers

import play.api.mvc._
import play.api.libs.concurrent.Akka
import akka.actor.Props
import actor._
import play.api.libs.json.JsValue
import actor.DataMerger._
import play.api.libs.iteratee.{Enumerator, Iteratee}
import akka.pattern.ask
import actor.DataMerger.RegisterConsumer
import actor.DataMerger.OrientationChangeEvent
import actor.DataMerger.OrientationChangeData
import actor.DataMerger.RegisterProducer
import play.api.Play.current
import akka.util.Timeout
import scala.concurrent.duration._
import scala.concurrent.ExecutionContext
import ExecutionContext.Implicits.global

object Application extends Controller {

  lazy val mergingActor = Akka.system.actorOf(Props[DataMerger])

  def index = Action {
    Ok(views.html.index("Your new application is ready."))
  }

  def mobileData = WebSocket.using[String] { request =>

    val device = request.path //TODO:
    mergingActor ! RegisterProducer(device)

    val in = Iteratee
      .foreach[String] { e =>
        mergingActor ! OrientationChangeEvent(device, OrientationChangeData(1.0, 2.0, 3.0))
        println(e)
      }
      .map(_ => "Disconnected")

    val out = Enumerator.empty[String]

    (in, out)
  }

  def dashboard = WebSocket.async[JsValue] { request =>
    implicit val timeout = Timeout(2 second)

    (mergingActor ? RegisterConsumer).map{
      case RegisterConsumerConfirmation(en) =>
        val in = Iteratee.ignore[JsValue]

        (in, en)
    }

  }


}