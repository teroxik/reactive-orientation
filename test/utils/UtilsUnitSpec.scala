package utils

import org.specs2.mutable._
import actors.StreamMergingActor.OrientationChangeEvent
import actors.StreamMergingActor.OrientationChangeData

class UtilsUnitSpec extends Specification {

  "The IpAddress util class" should {
    "return at localhost " in {
      val ipAddress = new Object with IpAddress
      ipAddress.getIpAddresses() must contain("127.0.0.1")
    }

  }

  "The DeegreesToRadians util class" should {
    "should convert degrees to radians " in {
      val degreesToRadians = new Object with DegreesToRadiansConversions

      val input = OrientationChangeEvent("test","test",5,OrientationChangeData(0.0,0.0,0.0))

      val expected = OrientationChangeEvent("test","test",5,OrientationChangeData(0.0,0.0,0.0))

      degreesToRadians.convertDegreesToRadians(input) mustEqual expected
    }

    "should convert degrees to radians " in {
      val degreesToRadians = new Object with DegreesToRadiansConversions

      val input = OrientationChangeEvent("test","test",5,OrientationChangeData(90,180,45))

      val degToRad = (number: Double) => number * 2 * Math.PI / 360

      val alpha = degToRad(input.data.alpha)
      val beta = degToRad(input.data.beta)
      val gamma = degToRad(input.data.gamma)

      val expected = OrientationChangeEvent("test","test",5,OrientationChangeData(alpha,beta,gamma))

      degreesToRadians.convertDegreesToRadians(input) mustEqual expected
    }

  }

}
